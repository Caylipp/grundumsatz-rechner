import type { UI } from './types';

export const vi: UI = {
  meta: {
    title: 'Tính BMR – càng nhiều thông tin, càng chính xác | Máy tính chuyển hóa cơ bản',
    description:
      'Máy tính BMR miễn phí có khoảng tin cậy: Mifflin-St Jeor, Katch-McArdle, phương pháp Navy, kẹp mỡ (3/7 nếp gấp da), RMR đo được và mức tiêu hao thực tế từ nhật ký của bạn. Không theo dõi người dùng.',
    ogLocale: 'vi_VN',
    langName: 'Tiếng Việt',
  },
  nav: { calculator: 'Máy tính', method: 'Cách chúng tôi tính', skip: 'Chuyển đến nội dung', language: 'Ngôn ngữ' },
  footer: {
    disclaimerStrong: 'Không phải tư vấn y tế.',
    disclaimer:
      'Kết quả là ước tính dựa trên các công thức khoa học và không thay thế lời khuyên của bác sĩ hay chuyên gia dinh dưỡng. Nếu bạn có bệnh lý, đang mang thai hoặc có rối loạn ăn uống, hãy tìm tư vấn chuyên môn.',
    privacy: 'Quyền riêng tư: mọi dữ liệu chỉ được xử lý và lưu trên trình duyệt của bạn. Không tài khoản, không cookie, không theo dõi.',
    method: 'Phương pháp & nguồn',
    privacyLink: 'Chính sách bảo mật',
    imprint: 'Thông tin pháp lý',
    legalGerman: '(tiếng Đức)',
  },
  hero: {
    h1: 'Tính chuyển hóa cơ bản (BMR)',
    leadHtml:
      'Hầu hết các máy tính chỉ dùng một công thức và đưa ra một con số tưởng như chính xác. Ở đây bạn thấy kết quả <strong>chính xác đến đâu</strong> – và mỗi thông tin bổ sung sẽ thu hẹp khoảng ước tính.',
  },
  form: {
    required: 'Bắt buộc',
    optionalHtml: 'Mọi thông tin khác đều <strong>không bắt buộc</strong> – mỗi thông tin giúp kết quả chính xác hơn.',
    noAnswer: 'Không trả lời',
    basics: {
      title: 'Dữ liệu cơ bản',
      sex: 'Giới tính',
      female: 'Nữ',
      male: 'Nam',
      sexHint: 'Giới tính sinh học – ảnh hưởng đến tỷ lệ cơ và mỡ, do đó ảnh hưởng đến công thức.',
      age: 'Tuổi',
      years: 'tuổi',
      height: 'Chiều cao',
      weight: 'Cân nặng',
    },
    bodyfat: {
      title: 'Tỷ lệ mỡ cơ thể',
      intro:
        'Bạn biết tỷ lệ mỡ của mình? Khi đó phép tính dùng khối lượng không mỡ (Katch-McArdle hoặc Cunningham). Độ chính xác phụ thuộc nhiều vào phương pháp đo.',
      percent: 'Mỡ cơ thể',
      source: 'Đo bằng',
      readings: 'Số lần đo',
      readingsHint: 'Cân đo mỡ dao động theo ngày. Hãy đo ví dụ 7 buổi sáng lúc đói và nhập giá trị trung bình – kết quả sẽ chính xác hơn.',
      pp: 'điểm %',
    },
    circ: {
      title: 'Số đo vòng',
      introHtml:
        'Chỉ với thước dây, ba công thức ước tính tỷ lệ mỡ của bạn: <strong>phương pháp Navy</strong> (eo, cổ, và hông với nữ), <strong>YMCA</strong> và <strong>Relative Fat Mass</strong> (cả hai chỉ cần vòng eo). Chỉ riêng vòng eo đã có ích.',
      waist: 'Vòng eo',
      neck: 'Vòng cổ',
      hip: 'Vòng hông',
      howto: 'Cách đo đúng',
      howtoWaistHtml: '<strong>Eo:</strong> đo ngang tại vị trí rốn, thở ra thoải mái, không hóp bụng.',
      howtoNeckHtml: '<strong>Cổ:</strong> ngay dưới thanh quản, thước hơi nghiêng xuống phía trước.',
      howtoHipHtml: '<strong>Hông:</strong> tại chỗ rộng nhất của mông.',
      howtoGeneral: 'Đo vào buổi sáng, thước ôm sát nhưng không siết. Đo hai lần và lấy trung bình.',
    },
    caliper: {
      title: 'Nếp gấp da (kẹp mỡ)',
      introHtml:
        'Kẹp mỡ (dụng cụ rẻ tiền) đo độ dày lớp mỡ dưới da. <strong>3 vị trí</strong> là đủ cho phương pháp Jackson-Pollock 3 điểm; với <strong>7 vị trí</strong> kết quả còn chính xác hơn. Với bắp tay trước, bắp tay sau, dưới xương bả vai và trên mào chậu, máy tính còn tính thêm Durnin-Womersley.',
      measurer: 'Người đo',
      self: 'Tự đo (kém chính xác hơn một chút)',
      trained: 'Người có kinh nghiệm (HLV, bác sĩ)',
      tag3: '3',
      tag7: '7',
      tag4: '4',
      status3: (n) => `Phương pháp 3 điểm: còn thiếu ${n} vị trí`,
      status7: (n) => `Phương pháp 7 điểm: còn thiếu ${n} vị trí`,
      done3: 'Đang dùng phương pháp 3 điểm',
      done7: 'Đang dùng phương pháp 7 điểm – độ chính xác kẹp mỡ tối đa',
      howto: 'Cách đo nếp gấp da',
      howtoGeneral:
        'Luôn đo bên phải cơ thể, cơ thả lỏng. Dùng ngón cái và ngón trỏ nhấc chắc nếp da, đặt kẹp cách 1 cm và đọc sau 2 giây. Mỗi vị trí đo 2–3 lần và lấy trung bình.',
      sites: {
        chest: { label: 'Ngực', howto: 'Chéo, giữa nếp nách và núm vú (nữ: một phần ba khoảng cách).' },
        abdomen: { label: 'Bụng', howto: 'Dọc, cách rốn 2 cm về bên phải.' },
        thigh: { label: 'Đùi', howto: 'Dọc, mặt trước, giữa nếp bẹn và xương bánh chè.' },
        triceps: { label: 'Bắp tay sau', howto: 'Dọc, mặt sau cánh tay, giữa vai và khuỷu tay.' },
        suprailiac: { label: 'Trên mào chậu', howto: 'Chéo, ngay trên xương hông, đường nách trước.' },
        subscapular: { label: 'Dưới xương bả vai', howto: 'Chéo (45°), dưới đỉnh xương bả vai 2 cm.' },
        midaxillary: { label: 'Giữa nách', howto: 'Dọc, đường nách giữa ngang mức cuối xương ức.' },
        biceps: { label: 'Bắp tay trước', howto: 'Dọc, mặt trước cánh tay, ngang vị trí đo bắp tay sau.' },
      },
    },
    factors: {
      title: 'Yếu tố khác',
      athleteHtml: '<strong>Nhiều cơ bắp</strong> – tập tạ đều đặn hoặc thể thao thi đấu trên một năm',
      thyroid: 'Tuyến giáp',
      thyroidOptions: {
        normal: 'Bình thường',
        hypo_treated: 'Suy giáp, đã điều trị',
        hypo_untreated: 'Suy giáp, chưa điều trị',
        hyper_treated: 'Cường giáp, đã điều trị',
        hyper_untreated: 'Cường giáp, chưa điều trị',
      },
      pregnancy: 'Mang thai / cho con bú',
      pregnancyOptions: { none: 'Không', t1: 'Mang thai, 3 tháng đầu', t2: 'Mang thai, 3 tháng giữa', t3: 'Mang thai, 3 tháng cuối', breastfeeding: 'Cho con bú' },
      sleep: 'Ngủ mỗi đêm (trung bình)',
      hours: 'giờ',
      climate: 'Môi trường',
      climateOptions: { moderate: 'Ôn hòa', cold: 'Thường lạnh (nhà mát, ở ngoài trời nhiều)', hot: 'Nóng quanh năm' },
      dietHtml: '<strong>Ăn kiêng lâu:</strong> thâm hụt calo khoảng 3 tháng trở lên hoặc đã giảm cân nhiều',
      smokerHtml: '<strong>Hút thuốc</strong> (thường xuyên)',
    },
    measured: {
      title: 'RMR đã đo',
      introHtml:
        'Cách chính xác nhất: thiết bị đo lượng oxy bạn hít vào và CO₂ bạn thở ra (<strong>đo nhiệt lượng gián tiếp</strong>). Từ đó có được mức tiêu hao khi nghỉ thực tế – không cần công thức.',
      kcal: 'RMR đo được',
      method: 'Đo bằng',
      conditionsTitle: 'Để phép đo hợp lệ',
      conditions: ['Buổi sáng, nhịn ăn ít nhất 8 giờ', 'Không tập luyện hôm trước, không caffeine hay nicotine trước khi đo', 'Nằm yên 20–30 phút rồi đo 10–15 phút', 'Lấy trung bình nhiều lần đo vào các ngày khác nhau'],
      whereTitle: 'Đo ở đâu và thế nào?',
      where: [
        'Phòng xét nghiệm: y học thể thao, phòng khám dinh dưỡng, bệnh viện đại học và một số phòng gym.',
        'Tại nhà: máy phân tích hơi thở cầm tay (ví dụ Breezing) đo RMR qua ống ngậm. Các thiết bị hơi thở giá rẻ chỉ báo "chế độ chuyển hóa" không cho giá trị kcal.',
      ],
    },
    activity: { title: 'Sinh hoạt & thể thao', arrow: '→ tổng tiêu hao', intro: 'BMR áp dụng khi nghỉ hoàn toàn. Nhân với mức vận động (PAL) sẽ ra tổng năng lượng tiêu hao mỗi ngày.', none: 'Không trả lời', sport: 'Tập luyện thêm' },
    adaptive: {
      title: 'Nhật ký: đo mức tiêu hao thực tế',
      badge: 'Chuẩn vàng',
      teaser: 'Ghi cân nặng và calo trong 2–4 tuần – từ đó tính ra mức tiêu hao thực tế của bạn. Đến nhật ký ↓',
    },
    remember: 'Ghi nhớ dữ liệu trên thiết bị này',
    reset: 'Xóa dữ liệu nhập',
  },
  result: {
    eyebrow: 'BMR của bạn',
    emptyValue: '– kcal',
    empty: 'Nhập giới tính, tuổi, chiều cao và cân nặng – kết quả hiện ngay lập tức.',
    perDay: 'kcal/ngày',
    range: (r, lo, hi) => `± ${r} kcal · khả năng cao trong khoảng ${lo} – ${hi} kcal`,
    narrowedHtml: (b, n) => `Chỉ với dữ liệu cơ bản: ± ${b} kcal (nét đứt) → với thông tin của bạn: <strong>± ${n} kcal</strong>`,
    narrowDefault: 'Mỗi thông tin bổ sung sẽ thu hẹp khoảng ước tính.',
    precision: 'Độ chính xác',
    method: 'Tính bằng',
    tdee: 'Tổng tiêu hao mỗi ngày',
    how: 'Kết quả được tính thế nào? ↓',
    tdeePal: (p) => `BMR × PAL ${p}`,
    tdeeCombined: (f, m) => `kết hợp công thức (${f}) và mức tiêu hao đo được (${m})`,
    tdeeMeasured: 'đo từ nhật ký của bạn',
    tdeeExtra: (k) => `gồm +${k} kcal cho con bú`,
    impliedPal: (p) => `PAL thực tế của bạn: ${p}`,
  },
  explain: {
    h2: 'Kết quả của bạn được tính thế nào',
    empty: 'Khi bạn nhập dữ liệu cơ bản, cách tính sẽ hiện ra ở đây từng bước.',
    steps: 'Các bước tính',
    suggest: 'Chính xác hơn nữa',
    hints: 'Lưu ý',
    body: 'Thành phần cơ thể',
    formulas: 'So sánh tất cả công thức',
    formulasIntro: 'Các công thức khác nhau cho ra giá trị khác nhau với cùng một người. Thay vì chọn một, chúng tôi kết hợp các công thức phù hợp theo độ chính xác.',
    thFormula: 'Công thức',
    thResult: 'Kết quả',
    thShare: 'Tỷ trọng trong kết quả',
    allFormulas: 'Tất cả công thức, giả định và nguồn →',
    sumMifflin: '= Mifflin-St Jeor',
    unchanged: 'Giá trị không đổi',
    rangeUnchanged: 'Khoảng không đổi',
    rangeBetter: (d) => `Khoảng chính xác hơn ${d} kcal`,
    rangeWorse: (d) => `Khoảng kém chắc chắn hơn ${d} kcal`,
    gain: (a, b) => `± ${a} → khoảng ± ${b} kcal`,
    noMore: 'Bạn đã dùng hết mọi lựa chọn. Chỉ đo lặp lại mới giúp chính xác hơn.',
    ffm: 'khối lượng không mỡ',
    fat: 'mỡ',
    pp: 'điểm %',
  },
  tracker: {
    h2: 'Nhật ký: đo mức tiêu hao thực tế',
    leadHtml:
      'Công thức chỉ ước tính – cơ thể bạn mới đo thật. Nếu ghi cân nặng (tốt nhất mỗi sáng) và lượng calo ăn vào trong 2–4 tuần, có thể tính ngược ra <strong>tổng tiêu hao thực tế</strong>: ăn 2.200 kcal mỗi ngày mà giảm nửa ký mỗi tuần nghĩa là bạn tiêu hao khoảng 2.750 kcal.',
    add: 'Thêm mục',
    date: 'Ngày',
    weight: 'Cân nặng (kg)',
    kcal: 'Đã ăn (kcal)',
    save: 'Lưu',
    hint: 'Có thể để trống một giá trị – ví dụ chỉ nhập cân nặng. Mục mới cùng ngày sẽ ghi đè mục cũ.',
    demo: 'Tải dữ liệu mẫu',
    exportCsv: 'Xuất CSV',
    importCsv: 'Nhập CSV',
    clear: 'Xóa nhật ký',
    chart: 'Xu hướng cân nặng',
    noWeights: 'Chưa có số liệu cân nặng.',
    entries: (n) => `Hiện ${n} mục`,
    thDate: 'Ngày',
    thWeight: 'Cân nặng',
    thKcal: 'kcal',
    action: 'Thao tác',
    deleteAria: (d) => `Xóa mục ngày ${d}`,
    notEnough: 'Chưa đủ dữ liệu',
    measured: 'Tổng tiêu hao đo được',
    measuredDetail: (p) =>
      `Trung bình ăn ${p.intake} kcal · xu hướng ${p.slope} kg/tuần · ${p.days} ngày (${p.from}–${p.to}), ${p.weights} lần cân, ${p.kcalDays} ngày có ghi calo`,
    palHtml: (b, p) => `Với BMR ${b} kcal, điều này tương ứng với hệ số vận động (PAL) <strong>${p}</strong>.`,
    teaserProgress: (d) => `Nhật ký của bạn: ${d} trên tối thiểu 14 ngày. Đến nhật ký ↓`,
    teaserMeasured: (v) => `Mức tiêu hao đo được: ${v} kcal/ngày. Đến nhật ký ↓`,
    errDate: 'Vui lòng chọn ngày.',
    errEmpty: 'Vui lòng nhập cân nặng và/hoặc calo.',
    errWeight: 'Cân nặng phải từ 25 đến 350 kg.',
    errKcal: 'Calo phải từ 300 đến 10.000.',
    errImport: 'Không tìm thấy dòng hợp lệ trong tệp (định dạng: ngày;cân nặng;kcal).',
    confirmDemo: 'Thay nhật ký hiện có bằng dữ liệu mẫu?',
    confirmClear: 'Xóa toàn bộ nhật ký trên thiết bị này?',
    legendWeight: 'Cân nặng',
    legendTrend: 'Xu hướng (làm mượt)',
    legendReg: 'Đường hồi quy',
    legendKcal: 'Calo',
    csvHeader: 'ngay;can_nang_kg;kcal',
    chartAria: 'Diễn biến cân nặng',
  },
  faqTitle: 'Câu hỏi thường gặp về BMR',
  faqMore: 'Chi tiết: tất cả công thức, giả định và nguồn →',
  faq: [
    {
      q: 'Chuyển hóa cơ bản (BMR) là gì?',
      a: 'BMR là lượng năng lượng cơ thể tiêu hao mỗi ngày khi nghỉ hoàn toàn – cho hô hấp, nhịp tim, não, các cơ quan và thân nhiệt. Ở hầu hết mọi người, BMR chiếm 60–70 % tổng năng lượng tiêu hao hằng ngày.',
    },
    {
      q: 'BMR và TDEE khác nhau thế nào?',
      a: 'Tổng năng lượng tiêu hao (TDEE) bao gồm thêm mọi vận động, tập luyện và tiêu hóa. TDEE được ước tính bằng BMR nhân hệ số vận động (PAL) – khoảng 1,4–1,5 với công việc văn phòng. Chính xác hơn nữa là tính ngược từ xu hướng cân nặng và lượng calo ăn vào.',
    },
    {
      q: 'Tại sao kết quả là một khoảng chứ không phải một con số?',
      a: 'Mỗi công thức là giá trị trung bình của nhiều người. Hai người cùng tuổi, cân nặng và chiều cao có thể chênh nhau vài trăm calo, ví dụ vì một người nhiều cơ hơn. Khoảng này chứa giá trị thật với xác suất khoảng 80 %. Bạn nhập càng nhiều, khoảng càng hẹp.',
    },
    {
      q: 'Làm sao xác định BMR chính xác hơn tại nhà?',
      a: 'Dùng thước dây (eo, cổ, hông), kẹp mỡ đo nếp gấp da (3 hoặc tốt hơn là 7 vị trí), cân đo mỡ lấy trung bình nhiều ngày, và nhật ký cân nặng – calo. Chính xác nhất là đo trực tiếp bằng phương pháp đo nhiệt lượng gián tiếp – tại phòng xét nghiệm hoặc bằng máy phân tích hơi thở cầm tay.',
    },
    {
      q: 'Công thức nào chính xác nhất?',
      a: 'Khi không có số liệu thành phần cơ thể, Mifflin-St Jeor được xem là công thức chuẩn đáng tin cậy nhất. Nếu biết tỷ lệ mỡ, các công thức dựa trên khối lượng không mỡ (Katch-McArdle, Cunningham) thường chính xác hơn. Máy tính này tự động kết hợp các công thức phù hợp theo độ chính xác.',
    },
    {
      q: 'Tôi có nên ăn ít hơn BMR không?',
      a: 'Không nên kéo dài nếu không có chuyên gia theo dõi. Để giảm cân lành mạnh, hãy ăn thấp hơn tổng tiêu hao khoảng 300–500 kcal. Ăn quá ít calo có thể gây mất cơ và thiếu vi chất.',
    },
    {
      q: 'Dữ liệu của tôi có được lưu không?',
      a: 'Chỉ lưu trên trình duyệt của bạn nếu bạn muốn. Không có dữ liệu nào gửi lên máy chủ, không cookie, không theo dõi. "Xóa dữ liệu nhập" và "Xóa nhật ký" sẽ xóa tất cả.',
    },
  ],
  methodik: {
    title: 'Phương pháp: cách chúng tôi tính BMR | Máy tính BMR',
    description: 'Các công thức (Mifflin-St Jeor, Katch-McArdle, Cunningham, Navy, YMCA, RFM, Jackson-Pollock, Durnin-Womersley), khoảng tin cậy, điều chỉnh và mức tiêu hao thích ứng – giải thích minh bạch kèm nguồn.',
    h1: 'Cách chúng tôi tính',
    lead: 'Không máy tính nào biết chính xác BMR của bạn – chỉ phép đo (đo nhiệt lượng gián tiếp) mới đến gần. Chúng tôi tận dụng tối đa thông tin bạn nhập và nói rõ kết quả chắc chắn đến đâu.',
    toc: 'Mục lục',
    thMethod: 'Phương pháp',
    thUncertainty: 'Độ bất định',
    pp: 'điểm phần trăm',
    thActivity: 'Sinh hoạt',
    sections: [
      {
        id: 'chuoi-cong-thuc',
        h2: 'Chuỗi công thức',
        html: `<p>Tùy theo thông tin bạn nhập, máy tính dùng các phương pháp phù hợp và kết hợp chúng:</p><ol>
<li><strong>Dữ liệu cơ bản</strong> → Mifflin-St Jeor, khoảng ± 10 %.</li>
<li><strong>Tỷ lệ mỡ</strong> (DEXA, cân…) → khối lượng không mỡ → Katch-McArdle hoặc Cunningham.</li>
<li><strong>Số đo vòng</strong> → phương pháp Navy, công thức YMCA, Relative Fat Mass.</li>
<li><strong>Nếp gấp da</strong> → Jackson-Pollock 3 hoặc 7 điểm, Durnin-Womersley.</li>
<li><strong>Yếu tố khác</strong> → điều chỉnh kèm độ bất định bổ sung.</li>
<li><strong>RMR đo được</strong> → đo nhiệt lượng gián tiếp, chính xác hơn mọi công thức.</li>
<li><strong>Nhật ký</strong> → tổng tiêu hao thực tế từ cân nặng và calo.</li></ol>`,
      },
      {
        id: 'co-so',
        h2: 'Mifflin-St Jeor',
        html: `<p>Công thức Mifflin-St Jeor (1990) được các tổng quan hệ thống đánh giá là công thức chuẩn đáng tin cậy nhất cho người trưởng thành khỏe mạnh:</p>
<code class="formula">Nam: 10 × cân nặng [kg] + 6,25 × chiều cao [cm] − 5 × tuổi + 5</code>
<code class="formula">Nữ: 10 × cân nặng [kg] + 6,25 × chiều cao [cm] − 5 × tuổi − 161</code>
<p>Công thức sai lệch trong khoảng ± 10 % ở khoảng 80 % người có cân nặng bình thường (Frankenfield 2005). Với thừa cân, thiếu cân rõ rệt và từ 65 tuổi, chúng tôi dùng ± 11,5 đến ± 15 %. Harris-Benedict chỉ để so sánh.</p>`,
      },
      {
        id: 'khong-mo',
        h2: 'Khối lượng không mỡ',
        html: `<p>Cơ và nội tạng khi nghỉ tiêu hao năng lượng gấp nhiều lần mô mỡ. Các công thức dựa trên khối lượng không mỡ (FFM) phản ánh điều này:</p>
<code class="formula">FFM = cân nặng × (1 − mỡ % / 100)</code>
<code class="formula">Katch-McArdle: 370 + 21,6 × FFM</code>
<code class="formula">Cunningham: 500 + 22 × FFM  (khi nhiều cơ bắp)</code>
<p>Độ chính xác phụ thuộc chủ yếu vào giá trị mỡ. Độ bất định điển hình (± điểm phần trăm, khoảng 80 %):</p>{{bodyfatTable}}
<p>Cân đo mỡ có sai số hệ thống (lượng nước, vị trí điện cực) và sai số ngẫu nhiên dao động theo ngày. Lấy trung bình nhiều lần đo chỉ giảm phần ngẫu nhiên. Nếp gấp da tự đo được cộng thêm ± 2,5 điểm phần trăm sai số.</p>`,
      },
      {
        id: 'so-do-vong',
        h2: 'Số đo vòng: Navy, YMCA, Relative Fat Mass',
        html: `<code class="formula">Navy nam: 495 / (1,0324 − 0,19077 × log₁₀(eo − cổ) + 0,15456 × log₁₀(chiều cao)) − 450</code>
<code class="formula">Navy nữ: 495 / (1,29579 − 0,35004 × log₁₀(eo + hông − cổ) + 0,221 × log₁₀(chiều cao)) − 450</code>
<code class="formula">YMCA: (−98,42 hoặc −76,76 + 4,15 × eo [in] − 0,082 × cân nặng [lb]) / cân nặng [lb] × 100</code>
<code class="formula">RFM: 64 (nam) hoặc 76 (nữ) − 20 × chiều cao / eo</code>
<p>Cả ba đều dựa vào vòng eo nên thường sai cùng chiều. Chúng tôi kết hợp chúng như một nhóm: cùng nhau chính xác hơn tối đa 10 % so với phương pháp đơn lẻ tốt nhất.</p>`,
      },
      {
        id: 'kep-mo',
        h2: 'Nếp gấp da: Jackson-Pollock và Durnin-Womersley',
        html: `<p>Từ tổng các nếp gấp da (mm) tính ra mật độ cơ thể, rồi đổi sang tỷ lệ mỡ bằng công thức Siri:</p>
<code class="formula">Mỡ % = 495 / mật độ − 450</code>
<ul><li><strong>3 điểm</strong> (Jackson &amp; Pollock 1978/1980): nam ngực, bụng, đùi; nữ bắp tay sau, trên mào chậu, đùi.</li>
<li><strong>7 điểm</strong>: ngực, giữa nách, bắp tay sau, dưới xương bả vai, bụng, trên mào chậu, đùi. Sai số từng nếp được bù trừ.</li>
<li><strong>4 điểm</strong> (Durnin &amp; Womersley 1974): bắp tay trước, bắp tay sau, dưới xương bả vai, trên mào chậu với hệ số theo tuổi.</li></ul>
<p>Khi có đủ 7 vị trí, công thức 7 điểm thay cho công thức 3 điểm. Giống số đo vòng, giá trị kẹp mỡ được kết hợp như một nhóm riêng.</p>`,
      },
      {
        id: 'ket-hop',
        h2: 'Kết hợp thay vì chọn một',
        html: `<p>Giá trị mỡ từ các nhóm phương pháp khác nhau (đo trực tiếp, số đo vòng, nếp gấp da) có sai số độc lập và được lấy trung bình theo phương sai nghịch đảo. Sau đó chúng tôi kết hợp Mifflin-St Jeor và công thức FFM thành trung bình có trọng số. Vì cả hai dùng một phần cùng dữ liệu, chúng tôi giả định tương quan sai số 0,5 – để kết quả không trông chính xác hơn thực tế.</p>`,
      },
      {
        id: 'yeu-to',
        h2: 'Yếu tố khác',
        html: `<p>Những yếu tố này làm thay đổi BMR nhưng chỉ ước lượng được một cách tương đối. Chúng tôi áp dụng thận trọng và nới rộng khoảng ước tính.</p>
<div class="table-scroll"><table><thead><tr><th>Yếu tố</th><th>Điều chỉnh</th><th>Độ bất định thêm</th></tr></thead><tbody>
<tr><td>Suy giáp chưa điều trị</td><td>−10 %</td><td>± 7 %</td></tr>
<tr><td>Cường giáp chưa điều trị</td><td>+15 %</td><td>± 12 %</td></tr>
<tr><td>Tuyến giáp đã điều trị</td><td>0 %</td><td>± 3 %</td></tr>
<tr><td>Mang thai 3 tháng đầu / giữa / cuối</td><td>0 / +5 / +10 %</td><td>± 3 / 4 / 5 %</td></tr>
<tr><td>Cho con bú</td><td>+500 kcal vào tổng tiêu hao</td><td>–</td></tr>
<tr><td>Ngủ dưới 6 giờ</td><td>−3 %</td><td>± 2 %</td></tr>
<tr><td>Môi trường lạnh / khí hậu nóng</td><td>+3 % / +2 %</td><td>± 2 %</td></tr>
<tr><td>Ăn kiêng lâu</td><td>−5 %</td><td>± 3 %</td></tr>
<tr><td>Hút thuốc</td><td>+4 %</td><td>± 3 %</td></tr></tbody></table></div>`,
      },
      {
        id: 'do-rmr',
        h2: 'RMR đo được',
        html: `<p>Phương pháp đo nhiệt lượng gián tiếp tính mức tiêu hao năng lượng từ lượng oxy hấp thụ và CO₂ thải ra (phương trình Weir). Chúng tôi giả định ± 6 % cho phép đo tại phòng xét nghiệm và ± 10 % cho thiết bị cầm tay. Kết quả đo được kết hợp với ước tính từ công thức theo độ chính xác – một phép đo phòng xét nghiệm tốt gần như tự quyết định kết quả. Nếu lệch hơn 15 % so với công thức, chúng tôi nhắc bạn kiểm tra điều kiện đo.</p>`,
      },
      {
        id: 'pal',
        h2: 'Tổng tiêu hao (PAL)',
        html: `<p>Tổng tiêu hao = BMR × mức vận động thể chất (PAL). Tập luyện cộng thêm +0,15 (2–3 lần/tuần) hoặc +0,3 (4–5 lần/tuần), kèm thêm ± 12 % độ bất định.</p>{{palTable}}`,
      },
      {
        id: 'thich-ung',
        h2: 'Mức tiêu hao thực tế từ nhật ký',
        html: `<p>Nếu bạn ghi cân nặng và calo ít nhất 14 ngày (lý tưởng 3–4 tuần):</p>
<code class="formula">Tiêu hao = calo trung bình ăn vào − xu hướng cân nặng [kg/ngày] × 7.700 kcal/kg</code>
<p>Xu hướng được xác định bằng hồi quy tuyến tính trong 28 ngày gần nhất. Khoảng ước tính tính đến nhiễu của cân, sai số khi đếm calo (± 7 %), những ngày thiếu dữ liệu và độ bất định của quy tắc 7.700 kcal khi giảm cân nhanh.</p>`,
      },
      {
        id: 'khoang',
        h2: 'Ý nghĩa của khoảng ước tính',
        html: `<p>"1.780 ± 178 kcal" nghĩa là: BMR thật của bạn nằm trong khoảng 1.602 đến 1.958 kcal với xác suất khoảng 80 %. Các độ bất định lấy từ các nghiên cứu kiểm chứng và đã được làm tròn – một thước đo trung thực về độ lớn, không phải thống kê chính xác tuyệt đối.</p>`,
      },
    ],
    sourcesTitle: 'Nguồn tham khảo',
    disclaimer: 'Máy tính này không thay thế tư vấn y tế. Nếu bạn có bệnh lý, đang mang thai hoặc cho con bú, hoặc có rối loạn ăn uống, hãy trao đổi với bác sĩ hoặc chuyên gia dinh dưỡng.',
  },
};
